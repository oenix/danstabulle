<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Entity\Candidature;
use DTB\BdBundle\Entity\Planche;
use DTB\BdBundle\Form\CandidatureType;

class CandidateController extends Controller
{
    public function drawerAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $bd = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee')->find($id);
        $candidature = new Candidature();
        
        $form = $this->createForm(new CandidatureType, $candidature);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $candidature->setUser($this->getUser());
                $candidature->setType("drawer");
                $candidature->setBd($bd);
                $em = $this->getDoctrine()->getManager();
                $em->persist($candidature);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array("id" => $id)));
            }
        }
        
        return $this->render('DTBBdBundle:Candidate:drawer.html.twig', array('bd' => $bd, 'form' => $form->createView()));
    }
    
    public function scenaristAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $bd = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee')->find($id);
        $candidature = new Candidature();
        
        $form = $this->createForm(new CandidatureType, $candidature);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $candidature->setUser($this->getUser());
                $candidature->setType("scenarist");
                $candidature->setBd($bd);
                $em = $this->getDoctrine()->getManager();
                $em->persist($candidature);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array("id" => $id)));
            }
        }
        
        return $this->render('DTBBdBundle:Candidate:scenarist.html.twig', array('bd' => $bd, 'form' => $form->createView()));
    }
    
    public function seeAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $bd = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee')->find($id);
        
        $role = array("admin" => ($bd->getCreator() == $this->getUser()),
                      "drawer" => $bd->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bd->getScenarists()->contains($this->getUser()));
        
        if (!$role['admin'])
        {
            throw new AccessDeniedHttpException('Votre rôle ne vous le permet pas');
        }
        
        $candidaturesDrawer = $this->getDoctrine()->getRepository('DTBBdBundle:Candidature')->findBy(array("bd" => $bd, "type" => "drawer"));
        $candidaturesScenarist = $this->getDoctrine()->getRepository('DTBBdBundle:Candidature')->findBy(array("bd" => $bd, "type" => "scenarist"));
                
        return $this->render('DTBBdBundle:Candidate:see.html.twig', array("bd" => $bd, "cd" => $candidaturesDrawer, "cs" => $candidaturesScenarist ));
    }
    
    public function validateAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $candidature = $this->getDoctrine()->getRepository('DTBBdBundle:Candidature')->find($id);
        $user = $candidature->getUser();
        $bd = $candidature->getBd();
        
        $role = array("admin" => ($bd->getCreator() == $this->getUser()),
                      "drawer" => $bd->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bd->getScenarists()->contains($this->getUser()));
        
        if (!$role['admin'])
        {
            throw new AccessDeniedHttpException('Votre rôle ne vous le permet pas');
        }
        
        if ($candidature->getType() == "drawer")
            $bd->addDrawer($user);
        else
            $bd->addScenarist ($user);
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($bd);
        $em->flush();
        
        $em->remove($candidature);
        $em->flush();
        
        return $this->redirect($this->generateUrl('dtb_bd_see_candidatures', array("id" => $bd->getId())));
    }
    
    public function deleteAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $candidature = $this->getDoctrine()->getRepository('DTBBdBundle:Candidature')->find($id);
        $bd = $candidature->getBd();
        
        $role = array("admin" => ($bd->getCreator() == $this->getUser()),
                      "drawer" => $bd->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bd->getScenarists()->contains($this->getUser()));
        
        if (!$role['admin'])
        {
            throw new AccessDeniedHttpException('Votre rôle ne vous le permet pas');
        }
        
        $em = $this->getDoctrine()->getManager();
        $em->remove($candidature);
        $em->flush();
        
        return $this->redirect($this->generateUrl('dtb_bd_see_candidatures', array("id" => $bd->getId())));
    }
}
