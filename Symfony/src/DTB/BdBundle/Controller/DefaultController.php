<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Form\BandeDessineeType;
use DTB\BdBundle\Entity\Planche;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class DefaultController extends Controller
{
    public function showAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        
        $bandeDessinee = $repository->find($id);
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        return $this->render('DTBBdBundle:Default:show.html.twig', array('bd' => $bandeDessinee,
            'role' => $role));
    }
    
    public function showPlancheAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Planche');
        
        $planche = $repository->findBy(array('page' => intval($id)))[0];
        $bandeDessinee = $planche->getBandeDessinee();
        
        $maxPagePlanche = $repository->findBy(array(), array('page' => "desc"))[0];
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        return $this->render('DTBBdBundle:Default:showPlanche.html.twig', array('bd' => $bandeDessinee,
            'role' => $role,
            'planche' => $planche,
            'nbPlanche' => $maxPagePlanche->getPage()));
    }
    
    public function showImageAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Image');
        
        $image = $repository->find($id);
        $planche = $image->getPlanche();
        $bandeDessinee = $planche->getBandeDessinee();
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        return $this->render('DTBBdBundle:Default:showImage.html.twig', array('bd' => $bandeDessinee,
            'role' => $role,
            'planche' => $planche,
            'image' => $image));
    }
    
    public function moveImageAction($id, $x, $y)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Image');
        
        $image = $repository->find($id);
        $image->setPosX($x);
        $image->setPosY($y);
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($image);
        $em->flush();
        
        return new \Symfony\Component\HttpFoundation\Response("Ok");
    }
    
    public function resizeImageAction($id, $x, $y)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Image');
        
        $image = $repository->find($id);
        $image->setWidth($x);
        $image->setHeight($y);
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($image);
        $em->flush();
        
        return new \Symfony\Component\HttpFoundation\Response("Ok");
    }
    
    public function addPlancheAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        $bandeDessinee = $repository->find($id);
        
        $maxPagePlanche = $this->getDoctrine()->getRepository('DTBBdBundle:Planche')
                               ->findBy(array(), array('page' => "desc"))[0];
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        if (!$role['admin'])
        {
            throw new AccessDeniedHttpException('Votre rôle ne vous le permet pas');
        }
 
        $planche = new Planche();
        $planche->setBandeDessinee($bandeDessinee);
        $planche->setPage($maxPagePlanche->getPage() + 1);
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($planche);
        $em->flush();
        
        return $this->redirect($this->generateUrl('dtb_bd_show', array('id' => $bandeDessinee->getId())));
    }
    
    public function createAction()
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $bandeDessinee = new BandeDessinee();
        
        $form = $this->createForm(new BandeDessineeType, $bandeDessinee);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $bandeDessinee->setCreator($this->getUser());
                $em = $this->getDoctrine()->getManager();
                $em->persist($bandeDessinee);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array('id' => $bandeDessinee->getId())));
            }
        }
        
        return $this->render('DTBBdBundle:Default:create.html.twig', array('form' => $form->createView()));
    }
    
    public function updateAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        $bandeDessinee = $repository->find($id);
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        if (!$role['admin'])
        {
            throw new AccessDeniedHttpException('Votre rôle ne vous le permet pas');
        }
        
        $form = $this->createForm(new BandeDessineeType, $bandeDessinee);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $em = $this->getDoctrine()->getManager();
                $em->persist($bandeDessinee);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array('id' => $bandeDessinee->getId())));
            }
        }
        
        return $this->render('DTBBdBundle:Default:update.html.twig', array('bd' => $bandeDessinee, 'form' => $form->createView()));
    }
}
