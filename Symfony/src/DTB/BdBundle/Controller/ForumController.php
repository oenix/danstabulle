<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Form\BandeDessineeType;
use DTB\BdBundle\Entity\Planche;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class ForumController extends Controller
{
    public function showAction($id)
    {
        $BDRepository = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee');
        $ForumRepository = $this->getDoctrine()->getRepository('DTBBdBundle:Forum');
        
        $bandeDessinee = $BDRepository->find($id);
        $forums = $ForumRepository->findBy(array('bandeDessinee' => $bandeDessinee));
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        return $this->render('DTBBdBundle:Forum:show.html.twig', array(
            'bd' => $bandeDessinee,
            'forums' => $forums,
            'role' => $role));
    }
    
    public function showForumAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Forum');
        
        $forum = $repository->find($id);
        $bandeDessinee = $forum->getBandeDessinee();
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        return $this->render('DTBBdBundle:Forum:showForum.html.twig', array(
            'bd' => $bandeDessinee,
            'role' => $role,
            'forum' => $forum));
    }
    
    public function showTopicAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Topic');
        
        $topic = $repository->find($id);
        $forum = $topic->getForum();
        $bandeDessinee = $forum->getBandeDessinee();
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()));
        
        return $this->render('DTBBdBundle:Forum:showTopic.html.twig', array(
            'bd' => $bandeDessinee,
            'role' => $role,
            'forum' => $forum,
            'topic' => $topic));
    }
    
    public function createTopicAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('Vous devez être connecté pour accéder à cette page.');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Forum');
        
        $forum = $repository->find($id);
        $bandeDessinee = $forum->getBandeDessinee();
        
        $topic = new \DTB\BdBundle\Entity\Topic();
        $form = $this->createForm(new \DTB\BdBundle\Form\TopicType(), $topic);
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $topic->setCreator($this->getUser());
                $topic->setTime(new \DateTime());
                $topic->setForum($forum);
                $em = $this->getDoctrine()->getManager();
                $em->persist($topic);
                $em->flush();

                return $this->redirect($this->generateUrl('dtb_show_topic', array('id' => $topic->getId())));
            }
        }

        return $this->render('DTBBdBundle:Forum:createTopic.html.twig', array(
            'forum' => $forum,
            'form' => $form->createView()));
    }
    
    public function createPostAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('Vous devez être connecté pour accéder à cette page.');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Topic');
        
        $topic = $repository->find($id);
        $forum = $topic->getForum();
        $bandeDessinee = $forum->getBandeDessinee();
        
        $post = new \DTB\BdBundle\Entity\Post();
        $form = $this->createForm(new \DTB\BdBundle\Form\PostType(), $post);
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $post->setCreator($this->getUser());
                $post->setTime(new \DateTime());
                $post->setTopic($topic);
                $em = $this->getDoctrine()->getManager();
                $em->persist($post);
                $em->flush();

                return $this->redirect($this->generateUrl('dtb_show_topic', array('id' => $topic->getId())));
            }
        }

        return $this->render('DTBBdBundle:Forum:createPost.html.twig', array(
            'forum' => $forum,
            'topic' => $topic,
            'form' => $form->createView()));
    }
    
    public function updateTopicAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('Vous devez être connecté pour accéder à cette page.');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Topic');
        
        $topic = $repository->find($id);
        $forum = $topic->getForum();
        $bandeDessinee = $forum->getBandeDessinee();
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()),
                      "creator" => ($topic->getCreator() == $this->getUser()));
        
        if (!$role['admin'] && !$role['creator'])
        {
            throw new AccessDeniedHttpException('Vous n\'êtes pas le créateur de ce topic. Vous ne pouvez donc accéder à cette page.');
        }
        
        $form = $this->createForm(new \DTB\BdBundle\Form\TopicType(), $topic);
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $em = $this->getDoctrine()->getManager();
                $em->persist($topic);
                $em->flush();

                return $this->redirect($this->generateUrl('dtb_show_topic', array('id' => $topic->getId())));
            }
        }
        
        return $this->render('DTBBdBundle:Forum:createTopic.html.twig', array(
            'forum' => $forum,
            'topic' => $topic,
            'edit' => true,
            'form' => $form->createView()));
    }
    
    public function updatePostAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('Vous devez être connecté pour accéder à cette page.');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Post');
        
        $post = $repository->find($id);
        $topic = $post->getTopic();
        $forum = $topic->getForum();
        $bandeDessinee = $forum->getBandeDessinee();
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()),
                      "creator" => ($post->getCreator() == $this->getUser()));
        
        if (!$role['admin'] && !$role['creator'])
        {
            throw new AccessDeniedHttpException('Vous n\'êtes pas le créateur de ce post. Vous ne pouvez donc accéder à cette page.');
        }
        
        $form = $this->createForm(new \DTB\BdBundle\Form\PostType(), $post);
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {                
                $em = $this->getDoctrine()->getManager();
                $em->persist($post);
                $em->flush();

                return $this->redirect($this->generateUrl('dtb_show_topic', array('id' => $topic->getId())));
            }
        }
        
        return $this->render('DTBBdBundle:Forum:createPost.html.twig', array(
            'forum' => $forum,
            'topic' => $topic,
            'post' => $post,
            'edit' => true,
            'form' => $form->createView()));
    }
    
    public function deleteTopicAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('Vous devez être connecté pour accéder à cette page.');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Topic');
        
        $topic = $repository->find($id);
        $forum = $topic->getForum();
        $bandeDessinee = $forum->getBandeDessinee();
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()),
                      "creator" => ($topic->getCreator() == $this->getUser()));
        
        if (!$role['admin'] && !$role['creator'])
        {
            throw new AccessDeniedHttpException('Vous n\'êtes pas le créateur de ce topic. Vous ne pouvez donc accéder à cette page.');
        }
        
        $em = $this->getDoctrine()->getManager();
            
        foreach($topic->getPosts() as $post)
        {
            $em->remove($post);
        }
        
        $em->remove($topic);
        $em->flush();
        
        return $this->redirect($this->generateUrl('dtb_show_forum', array('id' => $forum->getId())));
    }
    
    public function deletePostAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('Vous devez être connecté pour accéder à cette page.');
        }
        
        $repository = $this->getDoctrine()->getRepository('DTBBdBundle:Post');
        
        $post = $repository->find($id);
        $topic = $post->getTopic();
        $forum = $topic->getForum();
        $bandeDessinee = $forum->getBandeDessinee();
        
        $role = array("admin" => ($bandeDessinee->getCreator() == $this->getUser()),
                      "drawer" => $bandeDessinee->getDrawers()->contains($this->getUser()),
                      "scenarist" => $bandeDessinee->getScenarists()->contains($this->getUser()),
                      "creator" => ($post->getCreator() == $this->getUser()));
        
        if (!$role['admin'] && !$role['creator'])
        {
            throw new AccessDeniedHttpException('Vous n\'êtes pas le créateur de ce post. Vous ne pouvez donc accéder à cette page.');
        }
        
        $em = $this->getDoctrine()->getManager();
        $em->remove($post);
        $em->flush();
        
        return $this->redirect($this->generateUrl('dtb_show_topic', array('id' => $topic->getId())));
    }
}
